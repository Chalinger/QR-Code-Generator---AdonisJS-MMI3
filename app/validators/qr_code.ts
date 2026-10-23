import vine from '@vinejs/vine'

const CONTENT_MAX_LENGTH = 400

const hexColor = () => vine.string().regex(/^#[0-9a-fA-F]{6}$/)

const contentRules = vine.group([
    vine.group.if((data) => data.type === 'url', {
        content: vine
            .string()
            .trim()
            .maxLength(CONTENT_MAX_LENGTH)
            .url({ require_protocol: true, protocols: ['http', 'https'] }),
    }),
    vine.group.else({
        content: vine.string().trim().maxLength(CONTENT_MAX_LENGTH),
    }),
])

export const qrCodeValidator = vine.create(
    vine
        .object({
            // nullable() et pas optional() : le bodyparser transforme un champ laissé
            // vide en null (convertEmptyStringsToNull dans config/bodyparser.ts).
            title: vine.string().trim().maxLength(100).nullable(),
            type: vine.enum(['url', 'text']),
            foregroundColor: hexColor(),
            backgroundColor: hexColor(),
            // Le formulaire envoie toujours du texte ("300") : vine.number() le convertit en nombre.
            size: vine.number().withoutDecimals().range([100, 1000]),
            errorCorrection: vine.enum(['L', 'M', 'Q', 'H']),
        })
        .merge(contentRules)
)