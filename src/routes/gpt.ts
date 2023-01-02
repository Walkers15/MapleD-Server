import { Router } from "express";
import type { AxiosInstance } from "axios";
import axios from "axios";

export interface GptData {
  id: string;
  generations: Generation[];
}

export interface Generation {
  text: string;
  tokens: number;
}

export const gptRouter = Router();

gptRouter.post("/", async (req, res) => {
  const kakaoAxios: AxiosInstance = axios.create();
  kakaoAxios.defaults.headers.common.Authorization = `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_KEY}`;

  const getGptData = async (prompt: string): Promise<GptData> => {
    let response: GptData = null;
    await kakaoAxios
      .post<GptData>("https://api.kakaobrain.com/v1/inference/kogpt/generation", { prompt, max_tokens: 128 })
      .then((res) => (response = res.data));
    return response;
  };

  return res.json(await getGptData(req.body.prompt));
});
