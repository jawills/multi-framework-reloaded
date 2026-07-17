@RestResource(urlMapping='/soql-export')
global with sharing class SoqlExportResource {
  public SoqlExportResource() {
  }
  global class QueryRequest {
    public String query;
  }

  global class QueryResponse {
    public Integer totalSize;
    public List<SObject> records;
    public String error;
  }

  @HttpPost
  global static QueryResponse executeQuery() {
    QueryRequest request = (QueryRequest) JSON.deserialize(
      RestContext.request.requestBody.toString(),
      QueryRequest.class
    );
    if (String.isBlank(request.query)) {
      RestContext.response.statusCode = 400;
      throw new IllegalArgumentException('SOQL query is required.');
    }
    List<SObject> records;
    QueryResponse response = new QueryResponse();

    try {
      records = Database.query(request.query, AccessLevel.USER_MODE);
    } catch (QueryException e) {
      RestContext.response.statusCode = 400;
      response.error = e.getMessage();
      return response;
    }
    response.totalSize = records.size();
    response.records = records;

    return response;
  }
}
