# evolution-api-statusfix

Evolution API 2.3.7 (`evoapicloud/evolution-api`, digest `sha256:966625532d90…`) com uma correção de 3 linhas no Baileys 7.0.0-rc.9.

## Problema

O WhatsApp passou a enviar os status (stories) dos contatos como stanza `<status>` de nível superior. O Baileys 7.0.0-rc.9 não confirma (ack) essa stanza. Com isso:

- o servidor do WhatsApp retém as mensagens recebidas: a instância fica "open", envia normalmente, mas não recebe nada;
- a cada ~50 minutos a conexão cai com `stream errored out` / `stream:error ack class="status"`.

Desativar "Read Status" não resolve, e reconectar pelo QR code só resolve até o próximo status.

Referências:
- Issue: https://github.com/evolution-foundation/evolution-api/issues/2778
- PR com a correção oficial (ainda não incorporada): https://github.com/evolution-foundation/evolution-api/pull/2785

## Correção

`patch.js` adiciona em `node_modules/baileys/lib/Socket/messages-recv.js`:

```js
ws.on('CB:status', (node) => {
    sendMessageAck(node).catch(error => onUnexpectedError(error, 'acking status stanza'));
});
```

## Imagem

A GitHub Action (`.github/workflows/build.yml`) gera e publica a imagem no GitHub Container Registry a cada push na `main`:

```
ghcr.io/<usuario>/evolution-api-statusfix:2.3.7-statusfix
```

Para gerar localmente:

```
docker build -t evolution-api-wra:2.3.7-statusfix .
```

Quando a Evolution lançar uma versão oficial com essa correção, volte para a imagem oficial.
