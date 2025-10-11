import { createClient } from '@sanity/client';
import groq from 'groq';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2023-10-01';
const token = process.env.SANITY_WRITE_TOKEN;

export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

export const sanityWriteClient = projectId && token
  ? createClient({ projectId, dataset, apiVersion, token })
  : null;

export const queries = {
  posts: groq`*[_type == "post"] | order(publishedAt desc)[0...12]{
    _id, title, "slug": slug.current, excerpt, publishedAt, mainImage, status, tags
  }`,
  projects: groq`*[_type == "project"] | order(_createdAt desc)[0...12]{
    _id, title, "slug": slug.current, members, status, repoUrl, demoUrl, thumbnail
  }`,
  events: groq`*[_type == "event"] | order(date asc)[0...12]{
    _id, title, "slug": slug.current, date, location, status, summary, cover
  }`,
  eventBySlug: groq`*[_type == "event" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, date, location, status, summary, description,
    speakers[], agenda[], cover, mapEmbed
  }`,
};