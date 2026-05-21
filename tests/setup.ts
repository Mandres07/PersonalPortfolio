import { afterEach } from "vitest";

afterEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
    document.documentElement.className = "";
  }

  if (typeof localStorage !== "undefined") {
    localStorage.clear();
  }

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.clear();
  }
});
