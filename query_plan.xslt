<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
  xmlns:s="http://schemas.microsoft.com/sqlserver/2004/07/showplan">
  <xsl:output method="html" indent="no"/>

  <!-- Disable built-in recursive processing templates -->
  <xsl:template match="*|/|text()|@*" mode="NodeLabel" />
  <xsl:template match="/|text()|@*" mode="ToolTipContent" />

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
        <style type="text/css">
          canvas
          {
              position: absolute;
          }
          #qp-root
          {
              position: absolute;
              z-index: 1;
          }
        </style>
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
          <div class="qp-label"><xsl:value-of select="@StatementType" /></div>
          <xsl:apply-templates select="." mode="NodeLabel" />
          <xsl:call-template name="ToolTip" />
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
          <div class="qp-label"><xsl:value-of select="@PhysicalOp" /></div>
          <xsl:apply-templates select="." mode="NodeLabel" />
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
      <div class="qp-tt-header"><xsl:value-of select="@PhysicalOp" /></div>
      <xsl:apply-templates select="." mode="ToolTipContent" />
    </div>
  </xsl:template>

  <!-- Tool tip template used when there is no operation-type specific template -->
  <xsl:template match="*" mode="ToolTipContent">
    <table><xsl:call-template name="DefaultToolTipColumns" /></table>
  </xsl:template>

  <!-- Writes default tool-tip columns common to most nodes -->
  <xsl:template name="DefaultToolTipColumns">
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
      <td>
        <xsl:value-of select="@EstimateRows" />
      </td>
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
  </xsl:template>

  <!--
  ================================
  Operator specific node labels
  ================================
  The following section contains templates used for writing operator-type specific node labels.
  -->
  
  <xsl:template match="*[s:NestedLoops]" mode="NodeLabel">
    <div class="qp-label">(<xsl:value-of select="@LogicalOp" />)</div>
  </xsl:template>
  
  <xsl:template match="*[s:IndexScan]" mode="NodeLabel">
    <xsl:variable name="IndexName" select="concat(s:IndexScan/s:Object/@Table, '.', s:IndexScan/s:Object/@Index)" />
    <div class="qp-label">
      <xsl:value-of select="substring($IndexName, 0, 36)" />
      <xsl:if test="string-length($IndexName) >= 36">…</xsl:if>
    </div>
  </xsl:template>

  <!--
  ================================
  Operator specific tool tips
  ================================
  The following section contains templates used for writing operator-type specific tool tips.
  -->

  <xsl:template match="*[s:NestedLoops]" mode="ToolTipContent">
    <div>For each row in the top (outer) input, scan the bottom (inner) input, and output matching rows.</div>
    <table>
      <xsl:call-template name="DefaultToolTipColumns" />
    </table>
    <div class="qp-bold">Outer References</div>
    <div>
      <xsl:value-of select="s:NestedLoops/s:OuterReferences/s:ColumnReference/@Database" />.
      <xsl:value-of select="s:NestedLoops/s:OuterReferences/s:ColumnReference/@Schema" />.
      <xsl:value-of select="s:NestedLoops/s:OuterReferences/s:ColumnReference/@Table" />.
      <xsl:value-of select="s:NestedLoops/s:OuterReferences/s:ColumnReference/@Column" />
    </div>
  </xsl:template>
</xsl:stylesheet>
