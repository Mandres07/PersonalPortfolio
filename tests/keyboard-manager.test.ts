// @vitest-environment jsdom
import {
  buildProfilesInfo,
  createKeyboardCommands,
  dispatchCommandPaletteShortcut,
} from "@/lib/keyboard-manager";
import type { Profile } from "@/types";

describe("keyboard manager helpers", () => {
  const profiles: Profile[] = [
    {
      network: "GitHub",
      icon: "mdi:github",
      username: "Mandres07",
      url: "https://github.com/Mandres07",
    },
    {
      network: "LinkedIn",
      icon: "ri:linkedin-fill",
      username: "mariomorales07",
      url: "https://linkedin.com/in/mariomorales07",
    },
  ];

  test("builds profile command metadata from social profiles", () => {
    const info = buildProfilesInfo(profiles, "en");

    expect(info).toHaveLength(2);
    expect(info[0]).toMatchObject({
      id: "GitHub",
      title: "Visit GitHub",
      hotkey: "ctrl+G",
    });
  });

  test("creates resume and social commands with localized text", () => {
    const openWindow = vi.fn();
    const commands = createKeyboardCommands(
      buildProfilesInfo(profiles, "es"),
      "es",
      openWindow,
    );

    expect(commands[0].title).toBe("Imprimir CV");
    expect(commands[0].section).toBe("Acciones");

    commands[0].handler();
    commands[1].handler();

    expect(openWindow).toHaveBeenNthCalledWith(
      1,
      "/files/CV-Mario-Morales.pdf",
      "_blank",
    );
    expect(openWindow).toHaveBeenNthCalledWith(
      2,
      "https://github.com/Mandres07",
      "_blank",
    );
  });

  test("dispatches the command palette shortcut event", () => {
    const listener = vi.fn();
    document.addEventListener("keydown", listener);

    dispatchCommandPaletteShortcut(document, KeyboardEvent);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as KeyboardEvent;
    expect(event.key).toBe("K");
    expect(event.ctrlKey).toBe(true);
  });
});
