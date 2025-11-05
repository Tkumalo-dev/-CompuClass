import axios from 'axios';

const SKETCHFAB_API_TOKEN = process.env.EXPO_PUBLIC_SKETCHFAB_API_TOKEN;
const PC_MODEL_ID = process.env.EXPO_PUBLIC_PC_MODEL_ID;
const BASE_URL = 'https://api.sketchfab.com/v3';

class SketchfabService {
  async getModel(modelId = PC_MODEL_ID) {
    try {
      const response = await axios.get(`${BASE_URL}/models/${modelId}`, {
        headers: {
          'Authorization': `Token ${SKETCHFAB_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Sketchfab model:', error);
      throw error;
    }
  }

  async getModelDownload(modelId = PC_MODEL_ID) {
    try {
      const response = await axios.get(`${BASE_URL}/models/${modelId}/download`, {
        headers: {
          'Authorization': `Token ${SKETCHFAB_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching model download:', error);
      throw error;
    }
  }

  getModelViewerUrl(modelId = PC_MODEL_ID) {
    return `https://sketchfab.com/models/${modelId}/embed`;
  }
}

export default new SketchfabService();