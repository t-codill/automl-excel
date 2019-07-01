const algorithms = {
    classification: [
        "LogisticRegression",
        "SGD",
        "MultinomialNaiveBayes",
        "BernoulliNaiveBayes",
        "SVM",
        "LinearSVM",
        "KNN",
        "DecisionTree",
        "RandomForest",
        "ExtremeRandomTrees",
        "LightGBM",
        "GradientBoosting",
        "TensorFlowDNN",
        "TensorFlowLinearClassifier",
        "XGBoostClassifier"
    ],
    regression: [
        "ElasticNet",
        "GradientBoosting",
        "DecisionTree",
        "KNN",
        "LassoLars",
        "SGD",
        "RandomForest",
        "ExtremeRandomTrees",
        "LightGBM",
        "TensorFlowLinearRegressor",
        "TensorFlowDNN",
        "XGBoostRegressor"
    ]
};
export { algorithms as Algorithms };
