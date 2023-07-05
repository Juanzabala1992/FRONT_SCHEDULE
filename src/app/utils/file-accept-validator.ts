const matchAll = ".*";

function escapeForPattern(s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function assemblePattern(parts: string[]) {
  if (parts.length === 0) {
    return null;
  }

  const pattern = parts.join("|") || matchAll;
  return new RegExp(`^(${pattern})$`);
}

export class FileAcceptValidator {
  static parse(accept: string, size: any = null) {
    const parts = (accept || "").split(",").map((p) => p.trim());
    const nameParts = parts
      .filter((p) => p.startsWith("."))
      .map((p) => matchAll + escapeForPattern(p));
    const typeParts = parts
      .filter((p) => !p.startsWith("."))
      .map((part) => {
        const [type, subType] = part.split("/", 2);
        return subType === "*"
          ? escapeForPattern(`${type}/`) + matchAll
          : escapeForPattern(part);
      });

    const namePattern = assemblePattern(nameParts);
    const typePattern = assemblePattern(typeParts);

    return new FileAcceptValidator(namePattern, typePattern, size);
  }

  constructor(
    private namePattern: any = undefined,
    private typePattern: any = null,
    private size: any = null
  ) {}

  isValid(file: File) {
    if (
      this.namePattern === null &&
      this.typePattern === null &&
      this.size === null
    ) {
      return false;
    }

    let result: boolean = true;
    result =
      ((this.namePattern && this.namePattern.test(file.name)) ||
        (this.typePattern && this.typePattern.test(file.type))) &&
      this.size &&
      file.size <= this.size;

    return result;
  }
}
