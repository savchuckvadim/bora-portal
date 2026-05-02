import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class MatrixAdminService {
  private readonly client: AxiosInstance;
  private readonly accessToken: string;
  private readonly serverName: string;
  private readonly defaultUserPassword: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.accessToken = config.getOrThrow<string>("MATRIX_ADMIN_ACCESS_TOKEN");
    this.serverName = config.get<string>("MATRIX_SERVER_NAME", "matrix.local");
    this.defaultUserPassword = config.get<string>("MATRIX_DEFAULT_USER_PASSWORD", "Portal-Change-Me-123");
    this.baseUrl = config.get<string>("MATRIX_BASE_URL", "http://localhost:8008");
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      timeout: 10000,
    });
  }

  async registerUser(localpart: string, displayName: string): Promise<string> {
    const userId = `@${localpart}:${this.serverName}`;
    await this.client.put(`/_synapse/admin/v2/users/${encodeURIComponent(userId)}`, {
      displayname: displayName,
      password: this.defaultUserPassword,
      deactivated: false,
    });
    return userId;
  }

  async loginWithPassword(identifier: string): Promise<string> {
    const localpart = identifier.startsWith("@")
      ? identifier.slice(1).split(":")[0]
      : identifier;
    const response = await axios.post(`${this.baseUrl}/_matrix/client/v3/login`, {
      type: "m.login.password",
      identifier: {
        type: "m.id.user",
        user: localpart,
      },
      password: this.defaultUserPassword,
    });
    return response.data.access_token as string;
  }

  async createRoom(name: string): Promise<string> {
    const response = await this.client.post("/_matrix/client/v3/createRoom", {
      name,
      preset: "private_chat",
    });
    return response.data.room_id as string;
  }

  async inviteToRoom(roomId: string, userId: string): Promise<void> {
    await this.client.post(`/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/invite`, {
      user_id: userId,
    });
  }

  async sendMessage(roomId: string, message: string): Promise<void> {
    const txnId = Date.now();
    await this.client.put(
      `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
      {
        msgtype: "m.text",
        body: message,
      },
    );
  }
}
