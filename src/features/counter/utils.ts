export function bahtToSatang(value: string) {
  const [wholePart, fractionPart = ""] = value.trim().split(".");
  return Number(wholePart) * 100 + Number(fractionPart.padEnd(2, "0"));
}
