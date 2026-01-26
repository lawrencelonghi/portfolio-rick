import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function deleteAdmin() {
  try {
    // Listar admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true
      }
    });

    if (admins.length === 0) {
      console.log('\n❌ Nenhum admin encontrado.\n');
      process.exit(0);
    }

    console.log('\n=== Admins Cadastrados ===\n');
    admins.forEach((admin: any, index: number) => {
      console.log(`${index + 1}. ${admin.username}`);
    });
    console.log('');

    const username = await question('Digite o username do admin a deletar: ');

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      console.error(`\n❌ Admin "${username}" não encontrado.\n`);
      process.exit(1);
    }

    const confirm = await question(`\nTem certeza que deseja deletar "${username}"? (s/n): `);

    if (confirm.toLowerCase() !== 's') {
      console.log('\n❌ Operação cancelada.\n');
      process.exit(0);
    }

    await prisma.admin.delete({
      where: { username }
    });

    console.log(`\n✅ Admin "${username}" deletado com sucesso!\n`);

  } catch (error) {
    console.error('❌ Erro ao deletar admin:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

deleteAdmin();