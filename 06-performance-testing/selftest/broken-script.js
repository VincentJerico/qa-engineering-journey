// Self-test fixture for the "k6 scripts compile" CI job. It must NOT compile: CI runs `k6 inspect`
// on it and fails if k6 accepts it, which would mean the compile gate can't catch a broken script.
import http from 'k6/http';

export default function () {
  http.get('https://example.com'
}
