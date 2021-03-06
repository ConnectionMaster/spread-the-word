import Record from "./records/Record";
import * as MDNSUtil from "./MDNSUtil";

export interface ResponseOptions {
  answers?: Record[];
  additionals?: Record[];
}

export default class Response {
  answers: Record[];
  additionals: Record[] = [];

  constructor(options: ResponseOptions = {}) {
    this.answers = options.answers || [];
    this.additionals = options.additionals || [];
  }

  static parse(options: ResponseOptions, parseOptions?): Response {
    const answers = (options.answers || [])
      .map(x => MDNSUtil.parseRecord(x, parseOptions))
      .filter(x => x);
    const additionals = (options.additionals || [])
      .map(x => MDNSUtil.parseRecord(x, parseOptions))
      .filter(x => x);

    return new Response({
      ...options,
      answers,
      additionals
    });
  }

  static serialize(options: ResponseOptions, serializeOptions?): Response {
    const answers = (options.answers || [])
      .map(x => MDNSUtil.serializeRecord(x, serializeOptions))
      .filter(x => x);
    const additionals = (options.additionals || [])
      .map(x => MDNSUtil.serializeRecord(x, serializeOptions))
      .filter(x => x);

    return new Response({
      ...options,
      answers,
      additionals
    });
  }
}