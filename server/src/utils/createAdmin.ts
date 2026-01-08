import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
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

async function createAdmin() {
  try {
    console.log('\n=== Criar Admin ===\n');

    const username = await question('Digite o nome de usuário: ');
    const password = await question('Digite a senha: ');

    if (!username || !password) {
      console.error('❌ Usuário e senha são obrigatórios!');
      process.exit(1);
    }

    // Verificar se já existe admin com este username
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      console.error(`❌ Já existe um admin com o username "${username}"`);
      process.exit(1);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    console.log('\n✅ Admin criado com sucesso!');
    console.log(`ID: ${admin.id}`);
    console.log(`Username: ${admin.username}\n`);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();