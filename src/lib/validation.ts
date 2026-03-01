// Input validation & sanitization helpers

const VALID_ITEM_TYPES = ["NOTE", "LINK", "INSIGHT"] as const;
type ItemType = (typeof VALID_ITEM_TYPES)[number];

export function isValidItemType(type: string): type is ItemType {
  return VALID_ITEM_TYPES.includes(type as ItemType);
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Strip HTML tags to prevent stored XSS
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

// Limits
export const MAX_TITLE_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 50_000; // ~50KB
export const MAX_TAG_LENGTH = 50;
export const MAX_TAGS_COUNT = 20;
export const MAX_QUERY_LENGTH = 2000;
export const MAX_URL_LENGTH = 2048;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateKnowledgeInput(body: {
  title?: string;
  content?: string;
  type?: string;
  sourceUrl?: string;
  tags?: string[];
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.title || body.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (body.title.length > MAX_TITLE_LENGTH) {
    errors.push({
      field: "title",
      message: `Title must be under ${MAX_TITLE_LENGTH} characters`,
    });
  }

  if (!body.content || body.content.trim().length === 0) {
    errors.push({ field: "content", message: "Content is required" });
  } else if (body.content.length > MAX_CONTENT_LENGTH) {
    errors.push({
      field: "content",
      message: `Content must be under ${MAX_CONTENT_LENGTH} characters`,
    });
  }

  if (body.type && !isValidItemType(body.type)) {
    errors.push({
      field: "type",
      message: `Type must be one of: ${VALID_ITEM_TYPES.join(", ")}`,
    });
  }

  if (body.sourceUrl) {
    if (body.sourceUrl.length > MAX_URL_LENGTH) {
      errors.push({
        field: "sourceUrl",
        message: `URL must be under ${MAX_URL_LENGTH} characters`,
      });
    } else if (!isValidUrl(body.sourceUrl)) {
      errors.push({
        field: "sourceUrl",
        message: "Source URL must be a valid HTTP/HTTPS URL",
      });
    }
  }

  if (body.tags) {
    if (!Array.isArray(body.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else {
      if (body.tags.length > MAX_TAGS_COUNT) {
        errors.push({
          field: "tags",
          message: `Maximum ${MAX_TAGS_COUNT} tags allowed`,
        });
      }
      for (const tag of body.tags) {
        if (typeof tag !== "string" || tag.length > MAX_TAG_LENGTH) {
          errors.push({
            field: "tags",
            message: `Each tag must be a string under ${MAX_TAG_LENGTH} characters`,
          });
          break;
        }
      }
    }
  }

  return errors;
}

export function validatePatchInput(body: {
  title?: string;
  content?: string;
  type?: string;
  sourceUrl?: string;
  isFavorite?: unknown;
  summary?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push({ field: "title", message: "Title cannot be empty" });
    } else if (body.title.length > MAX_TITLE_LENGTH) {
      errors.push({
        field: "title",
        message: `Title must be under ${MAX_TITLE_LENGTH} characters`,
      });
    }
  }

  if (body.content !== undefined) {
    if (typeof body.content !== "string" || body.content.trim().length === 0) {
      errors.push({ field: "content", message: "Content cannot be empty" });
    } else if (body.content.length > MAX_CONTENT_LENGTH) {
      errors.push({
        field: "content",
        message: `Content must be under ${MAX_CONTENT_LENGTH} characters`,
      });
    }
  }

  if (body.type !== undefined && !isValidItemType(body.type)) {
    errors.push({
      field: "type",
      message: `Type must be one of: ${VALID_ITEM_TYPES.join(", ")}`,
    });
  }

  if (body.sourceUrl !== undefined && body.sourceUrl !== null) {
    if (
      typeof body.sourceUrl === "string" &&
      body.sourceUrl.length > 0 &&
      !isValidUrl(body.sourceUrl)
    ) {
      errors.push({
        field: "sourceUrl",
        message: "Source URL must be a valid HTTP/HTTPS URL",
      });
    }
  }

  if (body.isFavorite !== undefined && typeof body.isFavorite !== "boolean") {
    errors.push({
      field: "isFavorite",
      message: "isFavorite must be a boolean",
    });
  }

  return errors;
}
