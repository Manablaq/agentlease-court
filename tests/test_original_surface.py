import ast
from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


def _tree(source):
    return ast.parse(source)


def _classes(tree):
    return {node.name: node for node in tree.body if isinstance(node, ast.ClassDef)}


def _fields(node):
    direct = [
        (item.target.id, ast.unparse(item.annotation))
        for item in node.body
        if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name)
    ]
    if direct:
        return direct
    assignment = next(
        item for item in node.body
        if isinstance(item, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "__annotations__" for target in item.targets)
    )
    value = assignment.value
    if isinstance(value, ast.Dict):
        return [
            (ast.literal_eval(key), ast.unparse(annotation))
            for key, annotation in zip(value.keys, value.values)
        ]
    names = value.args[0].args[0].value.split()
    annotations = value.args[1].elts
    return list(zip(names, (ast.unparse(annotation) for annotation in annotations)))


def _public_methods(node):
    result = {}
    for item in node.body:
        if not isinstance(item, ast.FunctionDef):
            continue
        decorators = tuple(ast.unparse(value) for value in item.decorator_list)
        if any(value.startswith("gl.public.") for value in decorators):
            result[item.name] = (ast.unparse(item.args), decorators)
    return result


class OriginalSurfaceTests(unittest.TestCase):
    def test_compact_source_preserves_original_public_surface(self):
        current = _tree((ROOT / "contracts" / "agentlease_court.py").read_text())
        original = _tree(subprocess.run(
            ["git", "show", "ea1cd67:contracts/agentlease_court.py"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        ).stdout)
        current_classes = _classes(current)
        original_classes = _classes(original)
        for name in ("Publisher", "Job", "AgentLeaseCourt"):
            self.assertEqual(_fields(current_classes[name]), _fields(original_classes[name]), name)
        self.assertEqual(
            _public_methods(current_classes["AgentLeaseCourt"]),
            _public_methods(original_classes["AgentLeaseCourt"]),
        )


if __name__ == "__main__":
    unittest.main()
