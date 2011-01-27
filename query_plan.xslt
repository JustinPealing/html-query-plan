<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
  xmlns:s="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
  <xsl:output method="html" indent="no"/>

  <!-- TODO: Percentage costs -->
  
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
        <ul id="qp-root"><xsl:apply-templates select="s:ShowPlanXML/s:BatchSequence/s:Batch/s:Statements/s:StmtSimple" /></ul>
        <canvas id="qp-canvas"></canvas>
      </body>
    </html>
  </xsl:template>

  <!-- Matches a statement -->
  <xsl:template match="s:StmtSimple">
    <li>
      <div class="qp-td">
        <div class="qp-node">
          <xsl:element name="div">
            <xsl:attribute name="class">qp-icon-Result</xsl:attribute>
          </xsl:element>
          <div><xsl:value-of select="@StatementType" /></div>
          <xsl:apply-templates select="*" mode="NodeLabel" />
        </div>
      </div>
      <ul class="qp-td"><xsl:apply-templates select="*/s:RelOp" /></ul>
    </li>
  </xsl:template>
  
  <!-- Matches a branch in the query plan -->
  <xsl:template match="s:RelOp">
    <li>
      <div class="qp-td">
        <div class="qp-node">
          <xsl:element name="div">
            <xsl:attribute name="class">qp-icon-<xsl:value-of select="translate(@PhysicalOp, ' ', '')" /></xsl:attribute>
          </xsl:element>
          <div><xsl:value-of select="@PhysicalOp" /></div>
          <xsl:apply-templates select="*" mode="NodeLabel" />
          <xsl:call-template name="ToolTip" />
        </div>
      </div>
      <ul class="qp-td">
        <xsl:apply-templates select="*/s:RelOp" />
      </ul>
    </li>
  </xsl:template>

  <!-- Writes the tool tip -->
  <xsl:template name="ToolTip">
    <div class="qp-tt">
      <table>
        <tr>
          <th>Physical Operation</th>
          <td><xsl:value-of select="@PhysicalOp" /></td>
        </tr>
        <tr>
          <th>Logical Operation</th>
          <td><xsl:value-of select="@LogicalOp" /></td>
        </tr>
        <tr>
          <th>Actual Number of Rows</th>
          <td><xsl:value-of select="s:RunTimeInformation/s:RunTimeCountersPerThread/@ActualRows" /></td>
        </tr>
        <tr>
          <th>Estimated I/O Cost</th>
          <td><xsl:value-of select="@EstimateIO" /></td>
        </tr>
        <tr>
          <th>Estimated CPU Cost</th>
          <td><xsl:value-of select="@EstimateCPU" /></td>
        </tr>
        <!-- TODO <tr>
          <th>Estimated Number of Executions</th>
          <td><xsl:value-of select="@EstimateCPU" /></td>
        </tr> -->
        <tr>
          <th>Number of Executions</th>
          <td><xsl:value-of select="s:RunTimeInformation/s:RunTimeCountersPerThread/@ActualExecutions" /></td>
        </tr>
        <!-- TODO: Estimated Operator Cost -->
        <tr>
          <th>Estimated Subtree Cost</th>
          <td><xsl:value-of select="@EstimatedTotalSubtreeCost" /></td>
        </tr>
        <tr>
          <th>Estimated Number of Rows</th>
          <td><xsl:value-of select="@EstimateRows" /></td>
        </tr>
        <!-- TODO: Check this -->
        <tr>
          <th>Estimated Row Size</th>
          <td><xsl:value-of select="@AvgRowSize" />B</td>
        </tr>
        <!-- TODO: Actual Rebinds
             TODO: Actual Rewinds -->
        <tr>
          <th>Node ID</th>
          <td><xsl:value-of select="@NodeId" />B</td>
        </tr>
      </table>
    </div>
  </xsl:template>

  <!-- Writes the node label for Nested Loops -->
  <xsl:template match="s:NestedLoops" mode="NodeLabel">
    <div>(<xsl:value-of select="../@LogicalOp" />)</div>
  </xsl:template>
  
  <!-- Writes the node label for Clustered Index Seeps -->
  <xsl:template match="s:IndexScan" mode="NodeLabel">
    <div><xsl:value-of select="s:Object/@Table" />.<xsl:value-of select="s:Object/@Index" /></div>
  </xsl:template>
</xsl:stylesheet>
