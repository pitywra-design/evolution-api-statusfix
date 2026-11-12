FROM evoapicloud/evolution-api@sha256:966625532d9076a2381e973a271307d107e6f070450de3abeeea8bd18be07252
COPY patch.js /tmp/patch.js
RUN node /tmp/patch.js && node -e "require('/evolution/node_modules/baileys/lib/Socket/messages-recv.js')" && rm /tmp/patch.js
