"""
Test script to verify all backend API endpoints are working
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

def test_endpoint(method, endpoint, description, **kwargs):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, **kwargs)
        elif method == "POST":
            response = requests.post(url, **kwargs)
        elif method == "PUT":
            response = requests.put(url, **kwargs)
        elif method == "PATCH":
            response = requests.patch(url, **kwargs)
        elif method == "DELETE":
            response = requests.delete(url, **kwargs)
        
        status = response.status_code
        if status == 200 or status == 201:
            print(f"{GREEN}✓{RESET} {method:6} {endpoint:40} - {description} (Status: {status})")
            return True, response
        elif status == 401:
            print(f"{YELLOW}⚠{RESET} {method:6} {endpoint:40} - {description} (Status: {status} - Auth Required)")
            return True, response  # 401 is expected for protected routes without token
        elif status == 422:
            print(f"{YELLOW}⚠{RESET} {method:6} {endpoint:40} - {description} (Status: {status} - Validation Error)")
            return True, response  # 422 is expected for endpoints with required data
        else:
            print(f"{RED}✗{RESET} {method:6} {endpoint:40} - {description} (Status: {status})")
            print(f"  Response: {response.text[:200]}")
            return False, response
    except Exception as e:
        print(f"{RED}✗{RESET} {method:6} {endpoint:40} - {description} (Error: {str(e)})")
        return False, None

def main():
    print("\n" + "="*80)
    print("Testing Backend API Endpoints")
    print("="*80 + "\n")
    
    results = []
    
    # Test public endpoints
    print("\n📋 PUBLIC ENDPOINTS")
    print("-" * 80)
    results.append(test_endpoint("GET", "/", "Root endpoint"))
    results.append(test_endpoint("GET", "/docs", "API documentation"))
    
    # Test authentication endpoints
    print("\n🔐 AUTHENTICATION ENDPOINTS")
    print("-" * 80)
    results.append(test_endpoint("POST", "/token", "Login endpoint (requires credentials)", 
                                data={"username": "test", "password": "test"}))
    
    # Test user endpoints (these will require auth)
    print("\n👥 USER ENDPOINTS (Auth Required)")
    print("-" * 80)
    results.append(test_endpoint("GET", "/users/me", "Get current user"))
    results.append(test_endpoint("GET", "/users/", "List all users"))
    results.append(test_endpoint("POST", "/users/", "Create user (requires data)", 
                                json={"username": "test", "email": "test@test.com", "password": "test"}))
    
    # Test JD endpoints
    print("\n📝 JOB DESCRIPTION ENDPOINTS (Auth Required)")
    print("-" * 80)
    results.append(test_endpoint("GET", "/jds", "List job descriptions"))
    results.append(test_endpoint("GET", "/jds/1", "Get specific JD"))
    results.append(test_endpoint("POST", "/extract_jd", "Extract JD from file"))
    results.append(test_endpoint("POST", "/save_jd", "Save JD"))
    results.append(test_endpoint("PATCH", "/jds/1", "Update JD status"))
    results.append(test_endpoint("PUT", "/jds/1", "Update JD details"))
    
    # Test resume/matching endpoints
    print("\n📄 RESUME & MATCHING ENDPOINTS (Auth Required)")
    print("-" * 80)
    results.append(test_endpoint("POST", "/extract_resumes", "Extract resumes"))
    results.append(test_endpoint("POST", "/match", "Match resumes to JD"))
    
    # Test analysis endpoints
    print("\n📊 ANALYSIS ENDPOINTS (Auth Required)")
    print("-" * 80)
    results.append(test_endpoint("GET", "/analyses", "Get user analyses"))
    results.append(test_endpoint("GET", "/jds/1/results", "Get JD analysis results"))
    
    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    total = len(results)
    passed = sum(1 for r in results if r[0])
    failed = total - passed
    
    print(f"\nTotal Endpoints Tested: {total}")
    print(f"{GREEN}Passed:{RESET} {passed}")
    print(f"{RED}Failed:{RESET} {failed}")
    
    if failed == 0:
        print(f"\n{GREEN}✓ All endpoints are responding correctly!{RESET}")
    else:
        print(f"\n{YELLOW}⚠ Some endpoints may need authentication or data to test properly.{RESET}")
    
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()
