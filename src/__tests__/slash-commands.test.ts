import { describe, it, expect } from "vitest";
import { parseSlashCommand, expandSlashCommand } from "@/lib/slash-commands";

describe("parseSlashCommand", () => {
  it("parses /resumir with topic", () => {
    const result = parseSlashCommand("/resumir fisiologia cardíaca");
    expect(result.command).not.toBeNull();
    expect(result.command!.id).toBe("/resumir");
    expect(result.topic).toBe("fisiologia cardíaca");
  });

  it("parses /quizar without topic", () => {
    const result = parseSlashCommand("/quizar");
    expect(result.command).not.toBeNull();
    expect(result.command!.id).toBe("/quizar");
    expect(result.topic).toBe("");
  });

  it("returns null command for regular text", () => {
    const result = parseSlashCommand("o que é insuficiência cardíaca?");
    expect(result.command).toBeNull();
    expect(result.topic).toBe("o que é insuficiência cardíaca?");
  });

  it("handles all six commands", () => {
    const cmds = ["/resumir", "/explicar", "/quizar", "/caso", "/diferenciar", "/dose"];
    for (const cmd of cmds) {
      const result = parseSlashCommand(`${cmd} algo`);
      expect(result.command).not.toBeNull();
      expect(result.command!.id).toBe(cmd);
    }
  });

  it("does not match partial commands", () => {
    const result = parseSlashCommand("/res fisiologia");
    expect(result.command).toBeNull();
  });
});

describe("expandSlashCommand", () => {
  it("expands /resumir into structured prompt", () => {
    const result = expandSlashCommand("/resumir cascata de coagulação");
    expect(result.systemHint).not.toBeNull();
    expect(result.systemHint).toContain("RESUMO");
    expect(result.userMessage).toBe("cascata de coagulação");
  });

  it("returns original text for non-slash messages", () => {
    const result = expandSlashCommand("o que é edema pulmonar?");
    expect(result.systemHint).toBeNull();
    expect(result.userMessage).toBe("o que é edema pulmonar?");
  });

  it("provides fallback topic when slash command has no text", () => {
    const result = expandSlashCommand("/quizar");
    expect(result.systemHint).not.toBeNull();
    expect(result.userMessage).toContain("quizar");
  });

  it("/dose hint includes safety disclaimer", () => {
    const result = expandSlashCommand("/dose metformina");
    expect(result.systemHint).toContain("bula");
  });

  it("/caso hint avoids raw 'diagnóstico'", () => {
    const result = expandSlashCommand("/caso neurologia");
    expect(result.systemHint).toContain("raciocínio diagnóstico");
  });
});
