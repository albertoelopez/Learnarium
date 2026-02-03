export interface ConceptMapping {
  id: string;
  conceptText: string;
  objectId: string;
  mnemonicHint: string;
}

export interface ConceptMappingResponse {
  mappings: ConceptMapping[];
}
