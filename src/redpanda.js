import path from 'node:path'
import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'

export const user = 'kafkasu'
export const pass = 'kafkapw'
const externalPort = 31010
const externalProxyPort = 31012

const ns = new k8s.core.v1.Namespace('redpanda-ns', {
  metadata: {
    name: 'mongey-redpanda',
  },
})

const secret = new k8s.core.v1.Secret('sasl', {
  metadata: {
    namespace: ns.metadata.name,
  },
  data: {
    'superusers.txt': Buffer.from(`${user}:${pass}:SCRAM-SHA-512\n`).toString(
      'base64'
    ),
  },
})

const redpanda = new k8s.helm.v3.Release('redpanda', {
  repositoryOpts: {
    repo: 'https://charts.redpanda.com',
  },
  chart: 'redpanda',
  namespace: ns.metadata.name,
  values: {
    statefulset: {
      replicas: 1,
    },
    tls: {
      enabled: false,
    },
    auth: {
      sasl: {
        enabled: true,
        secretRef: secret.metadata.name,
      },
    },
    external: {
      addresses: ['localhost'],
    },
    listeners: {
      admin: {
        external: { default: { enabled: false } },
      },
      schemaRegistry: {
        enabled: false,
        external: { default: { enabled: false } },
      },
      kafka: {
        external: {
          default: {
            advertisedPorts: [externalPort],
          },
        },
      },
      http: {
        external: {
          default: {
            advertisedPorts: [externalProxyPort],
          },
        },
      },
    },
    storage: {
      hostPath: path.resolve('kafka'),
      persistentVolume: { enabled: false },
    },
  },
})

const host = pulumi.interpolate`${redpanda.name}.${redpanda.namespace}`
export const brokers = pulumi.interpolate`${host}:9093,localhost:${externalPort}`
