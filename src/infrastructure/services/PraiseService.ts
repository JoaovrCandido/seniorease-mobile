export const PraiseService = {
  getRandomPraise(
    action:
      | "task"
      | "notebook"
      | "reminder"
      | "meeting"
      | "paragraph"
      | "update"
      | "restore",
    userName?: string,
  ): string {
    const firstName =
      userName && userName.trim() !== "" ? userName.trim().split(" ")[0] : "";
    const nameStr = firstName ? `, ${firstName}` : "";

    const praises = {
      task: [
        `Parabéns${nameStr}! Mais uma tarefa concluída com sucesso! 🌟`,
        `Excelente trabalho${nameStr}! Está a ir muito bem! ⭐`,
        `Maravilhoso${nameStr}! Tarefa feita com dedicação. 🎉`,
        `Muito bem${nameStr}! Orgulho deste progresso! 👏`,
      ],
      notebook: [
        `Novo caderno criado${nameStr}! Um excelente espaço para as suas ideias. 📘`,
        `Tudo pronto${nameStr}! O seu novo caderno está à sua espera. ✨`,
      ],
      reminder: [
        `Lembrete guardado${nameStr}! Assim não se esquece de nada importante. ⏰`,
        `Perfeito${nameStr}! O seu compromisso está anotado em segurança. 💡`,
      ],
      meeting: [
        `Reunião agendada${nameStr}! Tudo organizado para o seu encontro. 📹`,
        `Excelente${nameStr}! É sempre bom manter o contacto. 🤝`,
      ],
      paragraph: [
        `Boa anotação${nameStr}! É ótimo registar os nossos pensamentos. 📝`,
        `Anotado com sucesso${nameStr}! As suas ideias estão seguras aqui. 🧠`,
      ],
      update: [
        `Tudo atualizado e em ordem${nameStr}! 🔄`,
        `Alterações guardadas com sucesso${nameStr}! 👍`,
      ],
      restore: [
        `Ufa! Ainda bem que guardamos isto${nameStr}. Restaurado com sucesso! ♻️`,
        `De volta ao lugar certo${nameStr}! 🪄`,
      ],
    };

    const list = praises[action] || praises.paragraph;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  },
};
