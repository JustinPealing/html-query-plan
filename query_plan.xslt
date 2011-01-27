<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
  xmlns:sh="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
  <xsl:output method="html" indent="no"/>

  <!-- Root template -->
  <xsl:template match="/">
    <html>
      <head>
        <title>Execution plan</title>
        <script src="jquery.min.js" type="text/javascript"></script>
        <script src="query_plan.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="query_plan.css" />
        <script type="text/javascript">
          $(document).ready( function() { qp_drawLines($("#qp-canvas"), $("#qp-root")); } );
        </script>
      </head>
      <body>
        <ul id="qp-root"><xsl:apply-templates select="sh:ShowPlanXML/sh:BatchSequence/sh:Batch/sh:Statements/sh:StmtSimple" /></ul>
        <canvas id="qp-canvas"></canvas>
      </body>
    </html>
  </xsl:template>

  <!-- Matches a statement -->
  <xsl:template match="sh:StmtSimple">
    <li>
      <div class="qp-td">
        <div class="qp-node">
          <xsl:element name="div">
            <xsl:attribute name="class">qp-icon-Result</xsl:attribute>
          </xsl:element>
          <div class="qp-label"><xsl:value-of select="@StatementType" /></div>
          <div class="qp-tt">Query information</div>
        </div>
      </div>
      <ul class="qp-td"><xsl:apply-templates select="*/sh:RelOp" /></ul>
    </li>
  </xsl:template>
  
  <!-- Matches a branch in the query plan -->
  <xsl:template match="sh:RelOp">
    <li>
      <div class="qp-td">
        <div class="qp-node">
          <xsl:element name="div">
            <xsl:attribute name="class">qp-icon-<xsl:value-of select="translate(@PhysicalOp, ' ', '')" /></xsl:attribute>
          </xsl:element>
          <div class="qp-label"><xsl:value-of select="@PhysicalOp" /></div>
          <div class="qp-tt">
            <table>
              <tr>
                <th>Average row size:</th>
                <td><xsl:value-of select="@AvgRowSize" /></td>
              </tr>
              <tr>
                <th>Estimate rows:</th>
                <td><xsl:value-of select="@EstimateRows" /></td>
              </tr>
              <tr>
                <th>Estimated total subtree cost:</th>
                <td><xsl:value-of select="@EstimatedTotalSubtreeCost" /></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <ul class="qp-td"><xsl:apply-templates select="*/sh:RelOp" /></ul>
    </li>
  </xsl:template>
</xsl:stylesheet>
