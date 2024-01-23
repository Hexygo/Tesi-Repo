from testcontainers.core.container import DockerContainer
from testcontainers.core import waiting_utils

import pytest
import re
from playwright.sync_api import Page, expect

BASE_URL = 'http://localhost:3000'

@pytest.fixture
def start_container():
    with DockerContainer('tesi--frontend').with_bind_ports(3000,3000) as container:
        return container
    
def test_has_title(start_container,page:Page):
    container = start_container.start()
    delay = waiting_utils.wait_for_logs(container, 'Accepting connections')
    page.goto(BASE_URL)
    expect(page).to_have_title(re.compile('Elliot Web'))
