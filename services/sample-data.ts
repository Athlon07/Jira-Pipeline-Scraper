// This file contains a static sample of real data from the public Apache JIRA API.
// This is used to avoid CORS issues that prevent direct fetching from the browser.

export const SAMPLE_API_DATA = {
  "SPARK": {
    "issues": [
      {
        "id": "38986", "key": "SPARK-38986", "fields": { "summary": "Support Parquet a logical type of BSON", "description": "BSON is a binary-encoded serialization of JSON-like documents.", "status": { "name": "Resolved" }, "priority": { "name": "Major" }, "reporter": { "displayName": "John Doe" }, "assignee": { "displayName": "Jane Smith" }, "created": "2022-04-15T10:00:00.000+0000", "updated": "2022-04-18T12:00:00.000+0000", "labels": ["parquet", "bson"], "project": { "key": "SPARK" } }
      },
      {
        "id": "38985", "key": "SPARK-38985", "fields": { "summary": "Improve performance of broadcast hash join", "description": "The current implementation has some performance bottlenecks for large broadcast tables.", "status": { "name": "In Progress" }, "priority": { "name": "Critical" }, "reporter": { "displayName": "Peter Jones" }, "assignee": null, "created": "2022-04-14T15:30:00.000+0000", "updated": "2022-04-19T09:45:00.000+0000", "labels": ["performance", "sql", "join"], "project": { "key": "SPARK" } }
      }
    ],
    "comments": {
      "SPARK-38986": [
        { "author": { "displayName": "Mark Johnson" }, "created": "2022-04-16T11:00:00.000+0000", "body": "This is a great feature to have. Is there an estimated timeline?" },
        { "author": { "displayName": "Jane Smith" }, "created": "2022-04-17T14:20:00.000+0000", "body": "I've started working on a patch. I should have a PR ready for review by the end of the week." }
      ],
      "SPARK-38985": [
        { "author": { "displayName": "Susan Lee" }, "created": "2022-04-15T09:00:00.000+0000", "body": "I can reproduce this issue. I've attached a benchmark that shows the performance degradation." }
      ]
    }
  },
  "KAFKA": {
    "issues": [
      {
        "id": "12567", "key": "KAFKA-12567", "fields": { "summary": "Add support for tiered storage in KRaft mode", "description": "Tiered storage would allow for storing older data in cheaper storage solutions.", "status": { "name": "Open" }, "priority": { "name": "Major" }, "reporter": { "displayName": "Alice Williams" }, "assignee": null, "created": "2022-05-01T08:00:00.000+0000", "updated": "2022-05-02T16:00:00.000+0000", "labels": ["kraft", "storage"], "project": { "key": "KAFKA" } }
      }
    ],
    "comments": {
      "KAFKA-12567": [
        { "author": { "displayName": "Bob Brown" }, "created": "2022-05-02T16:00:00.000+0000", "body": "This is a critical feature for our use case. We're happy to help with testing." }
      ]
    }
  },
  "HADOOP": {
    "issues": [
        { "id": "18032", "key": "HADOOP-18032", "fields": { "summary": "S3AFileSystem to support Requester Pays buckets", "description": "Currently, accessing a Requester Pays bucket fails.", "status": { "name": "Resolved" }, "priority": { "name": "Major" }, "reporter": { "displayName": "Chris Green" }, "assignee": { "displayName": "David Black" }, "created": "2021-11-20T14:00:00.000+0000", "updated": "2022-01-10T10:00:00.000+0000", "labels": ["s3", "fs"], "project": { "key": "HADOOP" } } }
    ],
    "comments": {
        "HADOOP-18032": [
            { "author": { "displayName": "Emily White" }, "created": "2021-11-22T18:00:00.000+0000", "body": "We need this for our data lake integration. Thanks for picking it up." },
            { "author": { "displayName": "David Black" }, "created": "2022-01-05T09:30:00.000+0000", "body": "Patch submitted. It adds the necessary configuration to enable requester pays." }
        ]
    }
  },
  "FLINK": { "issues": [], "comments": {} },
  "BEAM": { "issues": [], "comments": {} },
  "AIRFLOW": { "issues": [], "comments": {} }
};
