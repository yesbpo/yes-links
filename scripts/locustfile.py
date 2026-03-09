import os

from locust import HttpUser, between, task


class RedirectUser(HttpUser):
    wait_time = between(0.1, 0.5)
    short_code = os.getenv("TARGET_SHORT_CODE", "abc12")

    @task
    def redirect(self):
        self.client.get(f"/{self.short_code}", allow_redirects=False)
