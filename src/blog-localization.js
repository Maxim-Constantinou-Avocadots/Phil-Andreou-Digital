import translations from "../locales/el-blog.json";
import { isGreek } from "./i18n.js";

const cache = new WeakMap();

function contentBlocks(nodes, result = []) {
  for (const node of nodes || []) {
    if (["PARAGRAPH", "HEADING"].includes(node.type)) {
      const text = (node.nodes || []).map(child => child.textData?.text || "").join("").trim();
      if (text) result.push(text);
    } else if (node.type !== "IMAGE") contentBlocks(node.nodes, result);
  }
  return result;
}

function localizeNodes(nodes, blocks) {
  return (nodes || []).map(node => {
    const translated = { ...node };
    if (["PARAGRAPH", "HEADING"].includes(node.type)) {
      const original = (node.nodes || []).map(child => child.textData?.text || "").join("").trim();
      if (original && blocks[original]) {
        const text = blocks[original];
        const first = node.nodes?.[0];
        const colon = text.indexOf(": ");
        const labelWasBold = node.nodes?.length > 1 && first?.textData?.decorations?.some(decoration => decoration.type === "BOLD");
        translated.nodes = labelWasBold && colon > 0 ? [
          { type: "TEXT", id: "", nodes: [], textData: { text: text.slice(0, colon), decorations: first.textData.decorations } },
          { type: "TEXT", id: "", nodes: [], textData: { text: text.slice(colon), decorations: [] } }
        ] : [{ type: "TEXT", id: "", nodes: [], textData: { text, decorations: [] } }];
        return translated;
      }
    }
    if (node.type === "IMAGE" && node.imageData) {
      translated.imageData = { ...node.imageData };
      for (const key of ["altText", "caption"]) {
        const original = node.imageData[key];
        if (original && blocks[original]) translated.imageData[key] = blocks[original];
      }
    }
    if (node.nodes) translated.nodes = localizeNodes(node.nodes, blocks);
    return translated;
  });
}

export function localizePost(post) {
  if (!post || !isGreek) return post;
  if (cache.has(post)) return cache.get(post);
  const translated = translations[post.slug];
  const valid = translated && post.title === translated.sourceTitle && post.excerpt === translated.sourceExcerpt &&
    (!post.richContent || contentBlocks(post.richContent.nodes).every(block => translated.blocks[block]));
  if (!valid) {
    const original = { ...post, translated: false };
    cache.set(post, original);
    return original;
  }
  const first = Object.values(translated.blocks)[0];
  const excerpt = first.length > 340 ? first.slice(0, 337).replace(/\s+\S*$/, "") + "…" : first;
  const richContent = post.richContent ? { ...post.richContent, nodes: localizeNodes(post.richContent.nodes, translated.blocks) } : post.richContent;
  const imageCaption = Object.values(translated.blocks)[1];
  const result = {
    ...post,
    title: translated.title,
    excerpt,
    seoTitle: translated.title + " | Phil Andreou Digital",
    seoDescription: first.slice(0, 157).replace(/\s+\S*$/, "") + "…",
    coverAlt: imageCaption || translated.title,
    richContent,
    paragraphs: post.richContent ? contentBlocks(richContent.nodes) : post.paragraphs,
    translated: true
  };
  cache.set(post, result);
  return result;
}
