import { INotebookRepository } from "../../domain/repositories/INotebookRepository";

export class UpdateBlockUseCase {
  constructor(private notebookRepository: INotebookRepository) {}

  async execute(
    notebookId: string,
    blockId: string,
    newContent: unknown,
    newType: string,
    extra?: { date?: Date; url?: string },
  ): Promise<void> {
    const notebook = await this.notebookRepository.getById(notebookId);

    if (notebook) {
      const blockIndex = notebook.blocks.findIndex((b) => b.id === blockId);

      if (blockIndex !== -1) {
        // Utilizamos um 'double cast' para evitar erros de sobreposição de tipos do TypeScript
        const blockAsRecord = notebook.blocks[blockIndex] as unknown as Record<
          string,
          unknown
        >;

        // Tratamento seguro: Reuniões utilizam 'title', os restantes blocos utilizam 'content'
        if (newType === "meeting") {
          blockAsRecord.title = newContent;
        } else {
          blockAsRecord.content = newContent;
        }

        blockAsRecord.type = newType;

        if (extra?.date) {
          blockAsRecord.date = extra.date;
        }
        if (extra?.url) {
          blockAsRecord.meetingUrl = extra.url; // Propriedade correta para a reunião
          blockAsRecord.url = extra.url; // Fallback
        }

        notebook.updatedAt = new Date();
        await this.notebookRepository.save(notebook);
      }
    }
  }
}
