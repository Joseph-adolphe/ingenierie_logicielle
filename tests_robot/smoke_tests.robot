*** Settings ***
Library           SeleniumLibrary

*** Variables ***
${URL}            http://localhost:5173
${BROWSER}        Chrome

*** Test Cases ***
Verify Landing Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be    Helpix
    Page Should Contain    Vous êtes un professionnel ?
    Page Should Contain    Devenir Prestataire
    [Teardown]    Close Browser

Verify Navigation To Login
    Open Browser    ${URL}    ${BROWSER}
    Click Link    /login
    Wait Until Page Contains    Connexion
    Page Should Contain Element    xpath=//input[@type='email']
    Page Should Contain Element    xpath=//input[@type='password']
    [Teardown]    Close Browser
