import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Tool, ToolType } from 'src/modules/tools/domain/tool.entity';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export interface RunResult {
  output: string;
  success: boolean;
  error?: string;
}

@Injectable()
export class ToolRunnerService {
  async run(tool: Tool, params: Record<string, unknown>): Promise<RunResult> {
    if (tool.type === ToolType.WEBHOOK) {
      return this.runWebhook(tool, params);
    }
    return this.runScript(tool, params);
  }

  private async runWebhook(
    tool: Tool,
    params: Record<string, unknown>,
  ): Promise<RunResult> {
    try {
      const method = tool.webhookMethod ?? 'POST';
      const isGet = method === 'GET';

      const url = isGet
        ? `${tool.webhookUrl}?${new URLSearchParams(params as Record<string, string>)}`
        : tool.webhookUrl!;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(tool.webhookSecret && {
            Authorization: `Bearer ${tool.webhookSecret}`,
          }),
        },
        ...(!isGet && { body: JSON.stringify(params) }),
      });

      const text = await response.text();

      if (!response.ok) {
        return {
          output: '',
          success: false,
          error: `HTTP ${response.status}: ${text}`,
        };
      }

      return { output: text, success: true };
    } catch (e) {
      return { output: '', success: false, error: (e as Error).message };
    }
  }

  private async runScript(
    tool: Tool,
    params: Record<string, unknown>,
  ): Promise<RunResult> {
    const scriptWithParams = `
      const params = ${JSON.stringify(params)};
      ${tool.scriptContent}
    `;

    const tmpFile = join(tmpdir(), `toolsmith-${Date.now()}.js`);

    try {
      await writeFile(tmpFile, scriptWithParams);
      const { stdout, stderr } = await execAsync(`node ${tmpFile}`, {
        timeout: 30000,
      });

      if (stderr) {
        return { output: stdout, success: false, error: stderr };
      }

      return { output: stdout, success: true };
    } catch (e) {
      return { output: '', success: false, error: (e as Error).message };
    } finally {
      await unlink(tmpFile).catch(() => {});
    }
  }
}
