function Rule() {
  Lint.Rules.AbstractRule.apply(this, arguments);
}

Rule.prototype = Object.create(Lint.Rules.AbstractRule.prototype);
Rule.prototype.apply = function(sourceFile) {
  return this.applyWithWalker(new LicenceHeaderWalker(sourceFile, this.getOptions()));
};

function LicenceHeaderWalker() {
  Lint.RuleWalker.apply(this, arguments);
}

LicenceHeaderWalker.prototype = Object.create(Lint.RuleWalker.prototype);
LicenceHeaderWalker.prototype.visitSourceFile = function (node) {
  // create a failure at the current position
  var sourceText = this.getSourceFile().text;

  var licenceHeader = '/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates\n/// and other contributors as indicated by the @author tags.\n///\n/// Licensed under the Apache License, Version 2.0 (the "License");\n/// you may not use this file except in compliance with the License.\n/// You may obtain a copy of the License at\n///\n///   http://www.apache.org/licenses/LICENSE-2.0\n///\n/// Unless required by applicable law or agreed to in writing, software\n/// distributed under the License is distributed on an "AS IS" BASIS,\n/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n/// See the License for the specific language governing permissions and\n/// limitations under the License.\n';

  if ( sourceText.indexOf(licenceHeader) !== 0 ){
    this.addFailure(this.createFailure(0, 0, "Missing or incorrect project license header."));
  }

  Lint.RuleWalker.prototype.visitSourceFile.call(this, node);
};

exports.Rule = Rule;
