import type { Edge, Node, ReactFlowJsonObject } from "@xyflow/react";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  customGetAppVersions,
  customGetLatestVersion,
} from "@/customization/utils/custom-get-app-latest-version";
import { BASE_URL_API } from "../../constants/constants";
import { api } from "../../controllers/API/api";
import type {
  VertexBuildTypeAPI,
  VerticesOrderTypeAPI,
} from "../../types/api/index";
import type { FlowStyleType, FlowType } from "../../types/flow";

const GITHUB_API_URL = "https://api.github.com";
const DISCORD_API_URL =
  "https://discord.com/api/v9/invites/EqksyE2EX9?with_counts=true";

export async function getRepoStars(owner: string, repo: string) {
  try {
    const response = await api.get(`${GITHUB_API_URL}/repos/${owner}/${repo}`);
    return response?.data.stargazers_count;
  } catch (error) {
    console.error("Error fetching repository data:", error);
    return null;
  }
}

export async function getDiscordCount() {
  try {
    const response = await api.get(DISCORD_API_URL);
    return response?.data.approximate_member_count;
  } catch (error) {
    console.error("Error fetching repository data:", error);
    return null;
  }
}

export const getAppVersions = customGetAppVersions;
export const getLatestVersion = customGetLatestVersion;

export async function createApiKey(name: string) {
  try {
    const res = await api.post(`${BASE_URL_API}api_key/`, { name });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Saves a new flow to the database.
 *
 * @param {FlowType} newFlow - The flow data to save.
 * @returns {Promise<any>} The saved flow data.
 * @throws Will throw an error if saving fails.
 */
export async function saveFlow(
  newFlow: {
    name?: string;
    data: ReactFlowJsonObject | null;
    description?: string;
    style?: FlowStyleType;
    is_component?: boolean;
    parent?: string;
    last_tested_version?: string;
  },
): Promise<FlowType> {
  try {
    const response = await api.post(`${BASE_URL_API}flows/`, {
      name: newFlow.name,
      data: newFlow.data,
      description: newFlow.description,
      is_component: newFlow.is_component,
      parent: newFlow.parent,
      last_tested_version: newFlow.last_tested_version,
    });

    if (response.status !== 201) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getVerticesOrder(
  flowId: string,
  startNodeId?: string | null,
  stopNodeId?: string | null,
  nodes?: Node[],
  Edges?: Edge[],
): Promise<AxiosResponse<VerticesOrderTypeAPI>> {
  // nodeId is optional and is a query parameter
  // if nodeId is not provided, the API will return all vertices
  const config: AxiosRequestConfig<any> = {};
  if (stopNodeId) {
    config["params"] = { stop_component_id: stopNodeId };
  } else if (startNodeId) {
    config["params"] = { start_component_id: startNodeId };
  }
  const data = {
    data: {},
  };
  if (nodes && Edges) {
    data["data"]["nodes"] = nodes;
    data["data"]["edges"] = Edges;
  }
  return await api.post(
    `${BASE_URL_API}build/${flowId}/vertices`,
    data,
    config,
  );
}

export async function postBuildVertex(
  flowId: string,
  vertexId: string,
  input_value: string,
  files?: string[],
): Promise<AxiosResponse<VertexBuildTypeAPI>> {
  // input_value is optional and is a query parameter
  const data = {};
  if (typeof input_value !== "undefined") {
    data["inputs"] = { input_value: input_value };
  }
  if (data && files) {
    data["files"] = files;
  }
  return await api.post(
    `${BASE_URL_API}build/${flowId}/vertices/${vertexId}`,
    data,
  );
}
