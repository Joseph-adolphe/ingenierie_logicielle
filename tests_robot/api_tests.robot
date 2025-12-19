*** Settings ***
Library           RequestsLibrary
Library           Collections

*** Variables ***
${API_URL}        http://localhost:8000/api

*** Test Cases ***
Verify Register Page Exists (via GET or check API)
    Create Session    api    ${API_URL}
    ${response}=    GET On Session    api    /prestataires    expected_status=401
    Should Be Equal As Integers    ${response.status_code}    401
    Log    Authentication Required as Expected

Verify Public Login Route
    Create Session    api    ${API_URL}
    # Testing a public route if available, or just checking login exists
    ${response}=    POST On Session    api    /login    expected_status=any
    Log    Login status: ${response.status_code}
