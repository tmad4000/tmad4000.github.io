# Karabiner-Elements Mappings

## Gaming Mouse (Vendor 1241, Product 64589)

| Button | Action | Notes |
|--------|--------|-------|
| **'1'** | Command layer | Hold for modifier combos |
| '1' + Left click | Cmd+Tab | Switch to next app |
| '1' + Right click | Cmd+Shift+Tab | Switch to previous app |
| '1' + Middle click | Cmd+Space | Spotlight |
| **'2'** | Cmd+Tab | Instant app switch |
| **'3'** | Escape | |
| **'4'** | Control layer | Hold for modifier combos |
| '4' + Left click | Ctrl+Tab | Next browser tab |
| '4' + Right click | Ctrl+Shift+Tab | Previous browser tab |
| '4' + Middle click | Ctrl+Space | Input source switch |
| **'5'** | Enter | |
| **'6'** | Backslash (\\) | |
| **'7'** | Copy | Cmd+C |
| **'8'** | Chrome tab search | Cmd+Shift+A |
| **'9'** | Screenshot (clipboard) | Cmd+Ctrl+Shift+4 |
| **'0' (button 10)** | Paste | Cmd+V |
| **keypad_plus (11)** | Cmd+` | Switch window |
| **keypad_hyphen (12)** | Cmd+Shift+` | Reverse switch window |
| **Middle click** | Space | Only when '1' or '4' held |

## Foot Pedal - PCsensor FootSwitch (Vendor 13651, Product 45057)

**Setup:** Use **ElfKey** software from https://www.ikkegol.com/downloads.html to program the pedals.

*Note: Karabiner direct mapping didn't work well for modifier combos - ElfKey is the recommended solution.*

| Pedal | Programmed To | Purpose |
|-------|---------------|---------|
| **Left** | (configure in ElfKey) | Command |
| **Middle** | (configure in ElfKey) | Control |
| **Right** | (configure in ElfKey) | Tab |

## Other Active Rules

| Rule | Description |
|------|-------------|
| Caps Lock → Enter | Global simple modification |
| Left+Right click | Cmd+Tab (simultaneous) |
| Cmd+= | Cmd+` (switch window) |
| Cmd+Shift+= | Cmd+Shift+` (reverse) |
| Cmd+Opt+= | Normal Cmd+= (zoom in) |
| Cmd+. | Cmd+Tab |
| Cmd+Shift+. | Cmd+Shift+Tab |
| Left Shift+Caps Lock | Page Down |
| Right Shift+Caps Lock | Cmd+Mission Control |

## Device IDs Reference

| Device | Vendor ID | Product ID |
|--------|-----------|------------|
| Gaming Mouse | 1241 | 64589 |
| FootSwitch | 13651 | 45057 |
| Logitech Keyboard | 1133 | 50484 |

---
*Config file: `~/.config/karabiner/karabiner.json`*
