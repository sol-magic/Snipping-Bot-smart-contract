import { writeFileSync, existsSync } from 'fs';
import { Keypair } from "@solana/web3.js";
async function main() {
    // Nome do arquivo de chaves privadas
    let filename = 'private_keys.txt';

    // Verificar se o arquivo já existe
    let count = 1;
    while (existsSync(filename)) {
        // Se o arquivo existir, incrementar o contador e tentar um novo nome
        filename = `private_keys_${count}.txt`;
        count++;
    }

    // Gerar 10 chaves privadas e salvar em um arquivo
    const privateKeys: string[] = [];
    for (let i = 0; i < 10; i++) {
        const privateKey = generatePrivateKey();
        privateKeys.push(privateKey);
    }
    writeFileSync(filename, privateKeys.join('\n'));
    console.log(`Arquivo ${filename} criado com sucesso.`);
}

main().catch(console.error);

function generatePrivateKey(): string {
    const privateKeyBytes = Keypair.generate().secretKey as ArrayBuffer;
    return Buffer.from(privateKeyBytes).toString("hex");
}