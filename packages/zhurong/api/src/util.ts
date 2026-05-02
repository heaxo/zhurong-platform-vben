import {CUSTOM_BASE_PREFIX} from "./request";

export function getImageResourcesBaseURL(image: string): string {
  const { protocol, hostname, port } = window.location;
  const apiPort = port;
  const baseURL = `${protocol}//${hostname}${apiPort ? `:${apiPort}` : ''}/api${CUSTOM_BASE_PREFIX}`;
  console.debug("Basic URL of image resourcess:",baseURL);
  return `${baseURL}/staticResources?source=${encodeURIComponent(image)}`;
}
