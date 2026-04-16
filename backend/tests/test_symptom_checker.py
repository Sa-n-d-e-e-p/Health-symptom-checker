"""Backend tests for Healthcare Symptom Checker API"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000').rstrip('/')


class TestHealth:
    """Health check tests"""

    def test_api_root(self):
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestSymptomsCheck:
    """POST /api/symptoms/check tests"""

    def test_check_symptoms_success(self):
        """Full LLM call - may take 5-15 seconds"""
        response = requests.post(
            f"{BASE_URL}/api/symptoms/check",
            json={"symptoms": "Headache, fever 38.5°C, sore throat for 2 days"},
            timeout=30,
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "conditions" in data
        assert "next_steps" in data
        assert "disclaimer" in data
        assert isinstance(data["conditions"], list)
        assert len(data["conditions"]) >= 1
        assert isinstance(data["next_steps"], list)
        assert len(data["next_steps"]) >= 1
        # Validate condition structure
        cond = data["conditions"][0]
        assert "name" in cond
        assert "description" in cond
        assert "likelihood" in cond
        assert cond["likelihood"] in ["high", "medium", "low"]
        # Save ID for history tests
        pytest.__symptom_id = data["id"]

    def test_check_symptoms_short_input_rejected(self):
        response = requests.post(
            f"{BASE_URL}/api/symptoms/check",
            json={"symptoms": "ow"},
            timeout=10,
        )
        assert response.status_code == 400

    def test_check_symptoms_empty_input_rejected(self):
        response = requests.post(
            f"{BASE_URL}/api/symptoms/check",
            json={"symptoms": ""},
            timeout=10,
        )
        assert response.status_code == 400


class TestHistory:
    """GET /api/history and DELETE /api/history/{id} tests"""

    def test_get_history_returns_list(self):
        response = requests.get(f"{BASE_URL}/api/history", timeout=10)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_history_items_have_correct_structure(self):
        response = requests.get(f"{BASE_URL}/api/history", timeout=10)
        assert response.status_code == 200
        data = response.json()
        if len(data) > 0:
            item = data[0]
            assert "id" in item
            assert "symptoms" in item
            assert "conditions" in item
            assert "next_steps" in item
            assert "disclaimer" in item
            assert "created_at" in item
            # No _id (MongoDB objectId should be excluded)
            assert "_id" not in item

    def test_delete_history_item(self):
        # First create a record
        create_resp = requests.post(
            f"{BASE_URL}/api/symptoms/check",
            json={"symptoms": "TEST stomach pain, nausea, loss of appetite"},
            timeout=30,
        )
        assert create_resp.status_code == 200
        item_id = create_resp.json()["id"]

        # Delete it
        del_resp = requests.delete(f"{BASE_URL}/api/history/{item_id}", timeout=10)
        assert del_resp.status_code == 200
        data = del_resp.json()
        assert "message" in data

        # Verify deletion - should 404
        get_resp = requests.get(f"{BASE_URL}/api/history/{item_id}", timeout=10)
        assert get_resp.status_code == 404

    def test_delete_nonexistent_returns_404(self):
        response = requests.delete(f"{BASE_URL}/api/history/nonexistent-id-12345", timeout=10)
        assert response.status_code == 404
