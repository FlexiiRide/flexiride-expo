/**
 * Network connectivity test utility
 */

const BACKEND_URL = "https://flexiride-backend-hdoc.onrender.com/";

export interface NetworkTestResult {
  success: boolean;
  error?: string;
  responseTime?: number;
  statusCode?: number;
}

export async function testBackendConnectivity(): Promise<NetworkTestResult> {
  const startTime = Date.now();
  
  try {
    console.log("Testing backend connectivity to:", BACKEND_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    console.log(`Backend responded with status: ${response.status} in ${responseTime}ms`);
    
    return {
      success: response.ok,
      statusCode: response.status,
      responseTime,
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Backend connectivity test failed:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime,
    };
  }
}

export async function testHealthEndpoint(): Promise<NetworkTestResult> {
  const startTime = Date.now();
  
  try {
    console.log("Testing health endpoint:", `${BACKEND_URL}health`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${BACKEND_URL}health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    console.log(`Health endpoint responded with status: ${response.status} in ${responseTime}ms`);
    
    return {
      success: response.ok,
      statusCode: response.status,
      responseTime,
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Health endpoint test failed:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime,
    };
  }
}