from testcontainers.core.container import DockerContainer
from testcontainers.core import waiting_utils

import pytest
from playwright.sync_api import Page, expect

import os

@pytest.fixture
def start_container_frontend():
    with DockerContainer('tesi-repo-frontend').with_bind_ports(3000,3000) as container:
        return container

@pytest.fixture   
def start_container_backend():
    with DockerContainer('tesi-repo-backend').with_bind_ports(5000,5000) as container:
        return container

def test_can_run_trough_form(start_container_frontend,start_container_backend, page:Page): # Verifica il corretto funzionamento del form di upload
    backend = start_container_backend.start()
    delay = waiting_utils.wait_for_logs(backend, 'Press')

    frontend = start_container_frontend.start()
    delay = waiting_utils.wait_for_logs(frontend, 'Accepting connections')

    page.goto("http://localhost:3000/preprocessing")
    page.get_by_role("button", name="Start").click()
    page.get_by_role("button", name="Dataset").click()

    page.get_by_label("Random seed").click()
    page.get_by_label("Random seed").fill("42")
    page.get_by_label("Dataset binarization").check()
    page.get_by_label("Dataset binarization").uncheck()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("User Average").check()
    page.get_by_role("button", name="Next").click()

    page.get_by_label("Random Subsampling").check()
    page.get_by_label("Test set ratio").click()
    page.get_by_label("Test set ratio").fill("0.2")
    page.get_by_role("button", name="Next").click()

    page.get_by_text("Random k-fold Cross Validation").click()
    page.get_by_label("Value of k").click()
    page.get_by_label("Value of k").fill("5")
    page.get_by_role("button", name="Next").click()

    page.locator("input").set_input_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_dataset.tsv'))

    page.get_by_text("Process the strategy").click()
    
    with page.expect_download() as download_info:
        page.get_by_test_id('result').click()
    download = download_info.value

    backend.stop()
    frontend.stop()

def test_can_run_trough_form_recommendation(start_container_frontend, start_container_backend, page:Page): # Verifica il corretto funzionamento del form di upload della raccomandazione
    backend = start_container_backend.start()
    delay = waiting_utils.wait_for_logs(backend, 'Press')

    frontend = start_container_frontend.start()
    delay = waiting_utils.wait_for_logs(frontend, 'Accepting connections')

    page.goto("http://localhost:3000/recommendation")

    with page.expect_file_chooser() as fc_info: # Verifica che il form consenta l'upload di file
        page.get_by_text("Select a .tsv file").first.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_train.tsv'))
    with page.expect_file_chooser() as fc_info:
        page.get_by_text("Select a .tsv file").last.click()
    fc_info.value.set_files(os.path.join(os.path.dirname(__file__), 'data', 'sample_test.tsv'))

    page.get_by_text("Use top-k").check() # Verifica la funzionalità di topK
    expect(page.get_by_label("Value for k")).to_be_visible() 
    page.get_by_label("Value for k").click()
    page.get_by_label("Value for k").fill("15")
    page.get_by_label("Use top-k").uncheck()

    page.get_by_role("button", name="Add Model").click() # Controllo sulla funzionalità di aggiunta e rimozione dei modelli
    expect(page.get_by_test_id("model")).to_have_count(1)
    page.get_by_test_id("close").last.click()
    expect(page.get_by_test_id("model")).to_have_count(0)

    page.get_by_role("button", name="Add Model").click()
    page.locator("#loading_rec_model").nth(0).click()
    page.get_by_role("option", name="Unpersonalized Recommenders").click()
    page.locator("#loading_model").nth(0).click()
    page.get_by_role("option", name="MostPop").click()
    page.get_by_label("Validation metric").click()
    page.get_by_label("Validation metric").fill("nDCG")
    page.get_by_label("Validation rate").click()
    page.get_by_label("Validation rate").fill("10")

    page.get_by_role("button", name="Add Model").click()
    page.locator("#loading_rec_model").nth(1).click()
    page.get_by_role("option", name="Neighborhood-based Models").click()
    page.locator("#loading_model").nth(1).click()
    page.get_by_role("option", name="ItemKNN", exact=True).click()
    page.get_by_label("neighbors").click()
    page.get_by_label("neighbors").fill("50")
    page.get_by_label("similarity").click()
    page.get_by_label("similarity").fill("cosine")
    page.get_by_label("implementation").click()
    page.get_by_label("implementation").fill("standard")
    page.locator("#validation_metric").nth(1).click()
    page.locator("#validation_metric").nth(1).fill("nDCG")
    page.locator("#validation_rate").nth(1).click()
    page.locator("#validation_rate").nth(1).fill("10")

    page.get_by_role("button", name="Train models").click()
    with page.expect_download() as download_info:
        page.get_by_role("link", name="questo link").click()
    download = download_info.value

    backend.stop()
    frontend.stop()