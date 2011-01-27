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
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
        <script src="query_plan.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="query_plan.css" />
      </head>
      <body>
        <ul><xsl:apply-templates select="sh:ShowPlanXML/sh:BatchSequence/sh:Batch/sh:Statements/sh:StmtSimple" /></ul>
        <canvas id="canvas"></canvas>
      </body>
    </html>
  </xsl:template>

  <!-- Matches a statement -->
  <xsl:template match="sh:StmtSimple">
    <li>
      <table>
        <tr><th>Name</th><th>Value</th></tr>
        <tr>
          <td>Statement type</td>
          <td><xsl:value-of select="@StatementType" /></td>
        </tr>
        <tr>
          <td>Statement text</td>
          <td><pre><xsl:value-of select="@StatementText" /></pre></td>
        </tr>
      </table>
      <ul><xsl:apply-templates select="*/sh:RelOp" /></ul>
    </li>
  </xsl:template>
  
  <!-- Matches a branch in the query plan -->
  <xsl:template match="sh:RelOp">
    <li>
      <div class="op">
        <xsl:element name="div">
          <xsl:attribute name="class">icon-<xsl:value-of select="translate(@PhysicalOp, ' ', '')" /></xsl:attribute>
        </xsl:element>
        <table>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Logical operation</td>
            <td>
              <xsl:value-of select="@LogicalOp" />
            </td>
          </tr>
          <tr>
            <td>Physical operation</td>
            <td>
              <xsl:value-of select="@PhysicalOp" />
            </td>
          </tr>
        </table>
      </div>
      <ul><xsl:apply-templates select="*/sh:RelOp" /></ul>
    </li>
  </xsl:template>
</xsl:stylesheet>
