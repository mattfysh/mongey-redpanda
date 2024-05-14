# redpanda + @pulumi/kafka issue

to deploy the pulumi stack, you may need to configure your local kubernetes provider, then run these two steps:

1. `pulumi up --yes`
2. `pulumi up --yes --refresh`

The error is:

```
Error waiting for topic (test.topic) to become ready: couldn't find resource (21 retries)
```

The full logs of step 2:

```
pulumi up --yes --refresh
Previewing update (dev)

     Type                              Name                 Plan       Info
     pulumi:pulumi:Stack               mongey-redpanda-dev             2 messages
     ├─ kubernetes:core/v1:Namespace   redpanda-ns
 ~   ├─ kafka:index:Topic              test-topic           update     [diff: ~config]
     ├─ pulumi:providers:kafka         kafka-provider
     ├─ kubernetes:core/v1:Secret      sasl
     └─ kubernetes:helm.sh/v3:Release  redpanda

Diagnostics:
  pulumi:pulumi:Stack (mongey-redpanda-dev):
    (node:14361) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)

Resources:
    ~ 1 to update
    5 unchanged

Updating (dev)

     Type                              Name                 Status                  Info
     pulumi:pulumi:Stack               mongey-redpanda-dev  **failed**              1 error; 2 messages
     ├─ kubernetes:core/v1:Namespace   redpanda-ns
 ~   ├─ kafka:index:Topic              test-topic           **updating failed**     [diff: ~config]; 1 error
     ├─ pulumi:providers:kafka         kafka-provider
     ├─ kubernetes:core/v1:Secret      sasl
     └─ kubernetes:helm.sh/v3:Release  redpanda

Diagnostics:
  pulumi:pulumi:Stack (mongey-redpanda-dev):
    (node:14369) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
    (Use `node --trace-deprecation ...` to show where the warning was created)

    error: update failed

  kafka:index:Topic (test-topic):
    error: 1 error occurred:
    	* updating urn:pulumi:dev::mongey-redpanda::kafka:index/topic:Topic::test-topic: 1 error occurred:
    	* Error waiting for topic (test.topic) to become ready: couldn't find resource (21 retries)

Resources:
    5 unchanged

Duration: 27s
```
