import ast
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
TREE = ast.parse((ROOT / "contracts" / "agentlease_court.py").read_text())
HELPERS = {
    node.name: node
    for node in TREE.body
    if isinstance(node, ast.FunctionDef)
    and node.name in {"_sp", "_um"}
}
MODULE = ast.Module(body=[HELPERS["_sp"], HELPERS["_um"]], type_ignores=[])
ast.fix_missing_locations(MODULE)
NAMESPACE = {}
exec(compile(MODULE, "<publisher-binding>", "exec"), NAMESPACE)
uri_matches_publisher = NAMESPACE["_um"]


class PublisherBindingTests(unittest.TestCase):
    PUBLISHER = "https://delivery.example/records"

    def test_exact_and_descendant_paths_are_allowed(self):
        self.assertTrue(uri_matches_publisher(self.PUBLISHER, self.PUBLISHER))
        self.assertTrue(uri_matches_publisher(self.PUBLISHER + "/job-1.json", self.PUBLISHER))

    def test_origin_and_path_boundary_are_enforced(self):
        self.assertFalse(uri_matches_publisher("https://evil.example/records/job-1.json", self.PUBLISHER))
        self.assertFalse(uri_matches_publisher("https://delivery.example/records-archive/job-1.json", self.PUBLISHER))
        self.assertFalse(uri_matches_publisher("https://delivery.example/other/job-1.json", self.PUBLISHER))

    def test_ambiguous_url_forms_are_rejected(self):
        for uri in (
            self.PUBLISHER + "/../job-1.json",
            self.PUBLISHER + "/job-1.json?issuer=provider",
            self.PUBLISHER + "/job-1.json#latest",
            "https://provider:secret@delivery.example/records/job-1.json",
            "https://delivery.example/%6aob-1.json",
            "https://-delivery.example/records/job-1.json",
            "https://delivery.example-/records/job-1.json",
        ):
            self.assertFalse(uri_matches_publisher(uri, self.PUBLISHER), uri)


if __name__ == "__main__":
    unittest.main()
