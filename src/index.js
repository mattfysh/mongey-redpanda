import * as kafka from '@pulumi/kafka'
import { brokers, user, pass } from './redpanda.js'

const provider = new kafka.Provider('kafka-provider', {
  bootstrapServers: brokers.apply(x => x.split(',')),
  tlsEnabled: false,
  saslMechanism: 'scram-sha512',
  saslUsername: user,
  saslPassword: pass,
  kafkaVersion: '2.1.0',
})

new kafka.Topic(
  'test-topic',
  {
    name: 'test.topic',
    partitions: 1,
    replicationFactor: 1,
    config: {
      'cleanup.policy': 'delete',
      'retention.ms': 604800000,
      'retention.bytes': 1073741824,
      'max.message.bytes': 1048576,
    },
  },
  { provider }
)
