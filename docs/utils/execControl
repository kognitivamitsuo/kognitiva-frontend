/ execControl.js – Controle de concorrência e timeout

const execLocks = new Set();

export function lockExecucao(key) {
  if (execLocks.has(key)) return false;
  execLocks.add(key);
  setTimeout(() => execLocks.delete(key), 4000);
  return true;
}

export function timeoutExecucao(controller, ms = 4000) {
  return setTimeout(() => controller.abort(), ms);
}
