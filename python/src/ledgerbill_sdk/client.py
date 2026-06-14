from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import requests


@dataclass
class LedgerBillClient:
    base_url: str
    tenant_id: str | None = None
    api_key: str | None = None
    access_token: str | None = None
    timeout_seconds: float = 30.0

    def get_pricing_plans(self) -> dict[str, Any]:
        return self._request("GET", "/api/pricing/plans")

    def get_subscription_plans(self) -> dict[str, Any]:
        return self._request("GET", "/api/subscriptions/plans")

    def get_current_subscription(self) -> dict[str, Any]:
        return self._request("GET", "/api/subscriptions/current")

    def create_checkout_session(self, plan_id: str) -> dict[str, Any]:
        return self._request(
            "POST",
            "/api/subscriptions/checkout",
            json={"planId": plan_id},
            idempotency_key=f"py-sdk-checkout-{plan_id}",
        )

    def preview_usage(self, customer_id: str, feature_key: str, amount: int) -> dict[str, Any]:
        return self._request(
            "POST",
            "/api/v1/usage/preview",
            json={"customerId": customer_id, "featureKey": feature_key, "amount": int(amount)},
        )

    def report_usage(self, customer_id: str, feature_key: str, amount: int) -> dict[str, Any]:
        return self._request(
            "POST",
            "/api/v1/usage",
            json={"customerId": customer_id, "featureKey": feature_key, "amount": int(amount)},
            idempotency_key=f"py-sdk-usage-{customer_id}-{feature_key}-{amount}",
        )

    def _request(
        self,
        method: str,
        route: str,
        *,
        json: dict[str, Any] | None = None,
        idempotency_key: str | None = None,
    ) -> dict[str, Any]:
        base = self.base_url.rstrip("/")
        url = f"{base}{route}"

        headers: dict[str, str] = {"Accept": "application/json"}
        if self.tenant_id:
            headers["x-tenant-id"] = self.tenant_id
        if self.api_key:
            headers["x-api-key"] = self.api_key
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key

        response = requests.request(
            method=method.upper(),
            url=url,
            headers=headers,
            json=json,
            timeout=self.timeout_seconds,
        )

        if not response.ok:
            detail: Any
            try:
                detail = response.json()
            except Exception:
                detail = response.text
            raise RuntimeError(
                f"LedgerBill API {method.upper()} {route} failed: "
                f"{response.status_code} {response.reason} {detail}"
            )

        return response.json()
