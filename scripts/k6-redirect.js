import http from 'k6/http';
import { check } from 'k6';

const baseUrl = __ENV.TARGET_BASE_URL || 'http://localhost:8001';
const shortCode = __ENV.TARGET_SHORT_CODE || 'abc12';
const perfRps = Number(__ENV.PERF_RPS || 1000);
const perfDuration = __ENV.PERF_DURATION || '60s';

export const options = {
  scenarios: {
    redirect_load: {
      executor: 'constant-arrival-rate',
      rate: perfRps,
      timeUnit: '1s',
      duration: perfDuration,
      preAllocatedVUs: 200,
      maxVUs: 4000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<250'],
  },
};

export default function () {
  const res = http.get(`${baseUrl}/${shortCode}`, { redirects: 0 });
  check(res, {
    'status is 302 or 404': (r) => r.status === 302 || r.status === 404,
  });
}
