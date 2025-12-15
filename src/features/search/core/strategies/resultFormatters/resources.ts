import { IResultFormatter } from '../../types';

/**
 * Formats Work + Instance data for Resources search
 * Output: Array of Work objects with nested Instances
 */
export class ResourcesResultFormatter implements IResultFormatter<WorkAsSearchResultDTO> {
  format(data: unknown[]): WorkAsSearchResultDTO[] {
    const works = data as WorkAsSearchResultDTO[];

    return works.map(work => ({
      ...work,
      // Ensure each work has a consistent structure
      id: work.id,
      titles: work.titles || [],
      contributors: work.contributors || [],
      languages: work.languages || [],
      classifications: work.classifications || [],
      instances: (work.instances || []).map(instance => ({
        ...instance,
        id: instance.id,
        titles: instance.titles || [],
        identifiers: instance.identifiers || [],
        publications: instance.publications || [],
      })),
    }));
  }
}
