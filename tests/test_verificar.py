import subprocess
from conftest import RAIZ
PY = str(RAIZ / ".venv/bin/python")
def test_fixture_quebrada_falha():
    r = subprocess.run([PY, "scripts/verificar.py", "--templates", "tests/fixtures/templates", "--apenas", "99-99", "--sem-thumbs"], capture_output=True, text=True, cwd=RAIZ)
    assert r.returncode == 1
    for m in ["secao ausente: prova", "slot vazio ou inexistente: nao.existe", "rolagem horizontal"]:
        assert m in r.stdout, r.stdout
def test_apenas_filtra():
    r = subprocess.run([PY, "scripts/verificar.py", "--templates", "tests/fixtures/templates", "--apenas", "1-1", "--sem-thumbs"], capture_output=True, text=True, cwd=RAIZ)
    assert "99" not in r.stdout and "01" in r.stdout
