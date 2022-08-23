import * as R from "@play-co/replicant";

export function facebookGenericTemplate(opts: {
  title: string;
  subtitle?: string;
  image_url: string;
  cta: string;
  payload: object;
  facebookPlayerId?: string;
  facebookContextId?: string;
  url?: string;
}): R.FBChatbotMessage {
  const payload = JSON.stringify(opts.payload);
  const action = opts.url
    ? {
        type: 'web_url' as const,
        url: opts.url,
      }
    : {
        type: 'game_play' as const,
        payload: payload,
        game_metadata: {
          player_id: opts.facebookPlayerId,
          context_id: opts.facebookContextId,
        },
      };
  const button = {
    ...action,
    title: opts.cta,
  };
  const element = {
    title: opts.title,
    subtitle: opts.subtitle,
    image_url: opts.image_url,
    default_action: action,
    buttons: [button],
  };
  return {
    messaging_type: 'UPDATE',
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          image_aspect_ratio: 'square',
          elements: [element],
        },
      },
    },
  };
}

  /*** minimalist message
   
  "message": {
    "text": "hello, world!"
  }

  ***/

export function facebookSimpleTemplate (opts: {text:string}) {
    return {
        messaging_type: 'UPDATE',
        message: {
            text: opts.text
        },
    };
}