import { eveChannel } from 'eve/channels/eve';
import type { AuthFn } from 'eve/channels/auth';

function sharedKeyAuth(): AuthFn<Request> {
  return async (request) => {
    const key = request.headers.get('x-agent-key');
    if (key !== process.env.ZEN_AGENT_KEY) return null;
    return {
      attributes: {},
      authenticator: 'shared-key',
      principalId: 'taha',
      principalType: 'user',
    };
  };
}

export default eveChannel({
  auth: [sharedKeyAuth()],
});
